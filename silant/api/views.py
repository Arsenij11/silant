import datetime
import json

from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from .serializers import MachineSerializer, MachineDirectorySerializer, TOInfoSerializer
from silant_data.models import Machine, Directory_Machine, TO, Complaint, Service_Company, Directory_TO, \
    Directory_Complaint
from django.contrib.auth.models import Group, User

# Create your views here.

class MachineDetailAPIView(generics.RetrieveAPIView):
    def get_object(self):
        machine = get_object_or_404(Machine, pk = self.kwargs['factory_number'])
        return machine

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()


        access = Token.objects.filter(key = self.kwargs['token']).exists()

        obj = {
                'main_info' : {
                                 'factory_number': instance.factory_number,
                                 'machine_model': instance.directory.get(model_type='machine_model').name,
                                 'engine_model': instance.directory.get(model_type='engine_model').name,
                                 'engine_number': instance.engine_number,
                                 'transmission_model': instance.directory.get(model_type='transmission_model').name,
                                 'transmission_number': instance.transmission_number,
                                 'drive_axle_model': instance.directory.get(model_type='drive_axle_model').name,
                                 'drive_axle_number': instance.drive_axle_number,
                                 'steerable_bridge_model': instance.directory.get(model_type='steerable_bridge_model').name,
                                 'steerable_bridge_number': instance.steerable_bridge_number,
                                 'delivery_contract': instance.delivery_contract if access else '-',
                                 'date_shipment': str(instance.date_shipment) if access else '-',
                                 'customer': instance.customer if access else '-',
                                 'delivery_address': instance.delivery_address if access else '-',
                                 'equipment': instance.equipment if access else '-',
                                 'client': instance.client.username if access else '-',
                                 'service_company': instance.service_company.name if access else '-'
                },
                'more_info' : [
                     {
                        'name' : d.name,
                        'description' : d.description,
                        'model_type' : d.model_type,
                        'machine' : d.machine.factory_number
                     } for d in instance.directory.all()
                ]
            }

        return HttpResponse(json.dumps(obj, ensure_ascii=False))


class TOAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        to = TO.objects.filter(machine__factory_number = self.kwargs['factory_number'])
        return to

    def list(self, request, *args, **kwargs):
        to = self.get_queryset()
        if len(to) == 0:
            return HttpResponse(json.dumps({'detail' : 'По Вашему запросу ничего не найдено🤷‍♂️'}, ensure_ascii=False), status=404)

        objects = []
        for t in to:
            objects.append(
            {
                'main_info' : {
                    'id' : t.id,
                    'type_to' : t.directory_to.name,
                    'date_TO' : str(t.date_TO),
                    'operating_time' : t.operating_time,
                    'order_number' : t.order_number,
                    'date_order' : str(t.date_order),
                    'service_company' : t.service_company.name,
                    'machine' : t.machine.factory_number,
                },
                'more_info' : {
                    'id': t.id,
                    'name' : t.directory_to.name,
                    'description' : t.directory_to.description,
                    'machine' : t.machine.factory_number
                }
            }
            )

        return HttpResponse(json.dumps({'data' : objects}, ensure_ascii=False), status=200)

class ComplaintsAPIView(generics.ListAPIView):
    permission_classes = (IsAuthenticated, )
    def get_queryset(self):
        complaints = Complaint.objects.filter(machine__factory_number = self.kwargs['factory_number'])
        return complaints

    def list(self, request, *args, **kwargs):
        complaints = self.get_queryset()
        objects = []
        if len(complaints) == 0:
            return HttpResponse(json.dumps({'detail' : 'По Вашему запросу ничего не найдено🤷‍♂️'}, ensure_ascii=False), status=404)

        for complaint in complaints:
            objects.append({
                'main_info' : {
                    'id' : complaint.id,
                    'date_order' : str(complaint.date_order),
                    'operating_time' : complaint.operating_time,
                    'refusal_description' : complaint.refusal_description,
                    'using_extra_components' : complaint.using_extra_components,
                    'date_remaining' : str(complaint.date_remaining),
                    'downtime' : complaint.downtime,
                    'service_company' : complaint.service_company.name,
                    'machine' : complaint.machine.factory_number,
                    'refusal_node' : complaint.directory_complaint.get(directory_type = 'refusal_node').name,
                    'var_remaining' : complaint.directory_complaint.get(directory_type = 'var_remaining').name
                },
                'more_info' :
                    { 'id' : complaint.id,
                      'other_info' : [
                                {
                                    'name': c.name,
                                    'directory_type' : c.directory_type,
                                    'description': c.description,
                                    'machine': complaint.machine.factory_number
                                } for c in complaint.directory_complaint.all()
                            ]
                    }
            })

        return HttpResponse(json.dumps({'data' : objects}, ensure_ascii=False), status=200)

class AccountInfoAPIView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated, )

    def get_object(self):
        token = get_object_or_404(Token, key = self.request.auth.key)
        user = get_object_or_404(User, pk = token.user.id)
        return user

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        if user.username != self.kwargs['username']:
            return HttpResponse(json.dumps({'detail' : 'Ошибка! Токен и учётная запись не совпадают!'}, ensure_ascii=False), status=403)

        return self.retrieve(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        return HttpResponse(json.dumps({
            'group' : obj.groups.all()[0].name
        }, ensure_ascii=False))

class MachineCreateAPIView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        user_token = Token.objects.get(key = request.auth.key).user
        if user_token.groups.all()[0].name != 'Managers':
            return HttpResponse(json.dumps({'detail' : 'Доступ запрещён'}, ensure_ascii=False), status=403)
        if Machine.objects.filter(pk = dict(request.data)['factory_number']).exists():
            return HttpResponse(json.dumps({'detail' : 'Ошибка! Данные об этой машине уже находятся в базе!'}, ensure_ascii=False), status=400)

        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        main_info = {}
        more_info = []
        data = dict(request.data)
        for k,v in data.items():
            print(k, v, sep = " - ", end = ';\n')
        try:
            data['client'] = User.objects.get(pk = int(data['client']))
            data['service_company'] = Service_Company.objects.get(pk = int(data['service_company']))
            for key, value in data.items():
                types = {
                    'machine_model' : 'machine_model_description',
                    'engine_model' : 'engine_model_description',
                    'transmission_model' : 'transmission_model_description',
                    'drive_axle_model' : 'drive_axle_model_description',
                    'steerable_bridge_model' : 'steerable_bridge_model_description'
                }

                if key in types.keys():
                    more_info.append({'model_type' : key,
                                      'name' : value,
                                      'description' : data[types.get(key)],
                                      'machine' : data['factory_number']})
                elif key not in types.values():
                    main_info[key] = value


            machine = Machine.objects.create(**main_info)
            print(machine)
            for m in more_info:
                m['machine'] = Machine.objects.get(factory_number = m['machine'])
                Directory_Machine.objects.create(**m)
        except Exception as error:
            for m in more_info:
                if Directory_Machine.objects.filter(name = m['name'], machine__factory_number = data['factory_number']).exists():
                    Directory_Machine.objects.get(name = m['name'], machine__factory_number = data['factory_number']).delete()
            if Machine.objects.filter(factory_number = data['factory_number']).exists():
                Machine.objects.get(factory_number = data['factory_number']).delete()

            return HttpResponse(json.dumps({'detail' : 'Произошла ошибка ' + str(error)}, ensure_ascii=False), status = 400)

        return HttpResponse(json.dumps({'detail' : 'ok'}, ensure_ascii=False), status=201)

class TOCreateAPIView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated, )

    def create(self, request, *args, **kwargs):
        main_info = {}
        more_info = []
        data = dict(request.data)
        num = None
        for k,v in data.items():
            print(k, v, sep = " - ", end = ';\n')
        try:
            data['machine'] = Machine.objects.get(pk = data['machine'])
            data['service_company'] = Service_Company.objects.get(pk = int(data['service_company']))
            for key, value in data.items():
                if key == 'name':
                    more_info.append({
                                      'name' : key,
                                      'description' : data['description'],
                                      'num_TO' : None
                                      })
                elif key != 'description':
                    main_info[key] = value


            to = TO.objects.create(**main_info)
            num = to.id

            for m in more_info:
                m['num_TO'] = TO.objects.get(pk = num)
                Directory_TO.objects.create(**m)

        except Exception as error:
            if Directory_TO.objects.filter(num_TO_id = num).exists():
                Directory_TO.objects.get(num_TO_id  = num).delete()
            if TO.objects.filter(pk = num).exists():
                TO.objects.get(pk = num).delete()

            return HttpResponse(json.dumps({'detail' : 'Произошла ошибка ' + str(error)}, ensure_ascii=False), status = 400)

        return HttpResponse(json.dumps({'detail' : 'ok'}, ensure_ascii=False), status=201)

class ComplaintCreateAPIView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        user_token = Token.objects.get(key = request.auth.key).user
        if user_token.groups.all()[0].name not in ['Managers', 'Service_Company']:
            return HttpResponse(json.dumps({'detail' : 'Доступ запрещён'}, ensure_ascii=False), status=403)

        return self.create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        main_info = {}
        more_info = []
        data = dict(request.data)
        num = None
        for k,v in data.items():
            print(k, v, sep = " - ", end = ';\n')
        try:
            data['service_company'] = Service_Company.objects.get(pk = int(data['service_company']))
            data['machine'] = Machine.objects.get(pk = data['machine'])
            for key, value in data.items():
                types = {
                    'refusal_node' : 'refusal_node_description',
                    'var_remaining' : 'var_remaining_description',
                }

                if key in types.keys():
                    more_info.append({'directory_type' : key,
                                      'name' : value,
                                      'description' : data[types.get(key)],
                                      'complaint' : None})

                elif key not in types.values():
                    main_info[key] = value


            complaint = Complaint.objects.create(**main_info)
            num = complaint.id
            for m in more_info:
                m['complaint'] = Complaint.objects.get(pk = num)
                Directory_Complaint.objects.create(**m)

        except Exception as error:
            for m in more_info:
                if Directory_Complaint.objects.filter(complaint_id = num, name = m['name']).exists():
                    Directory_Complaint.objects.get(complaint_id = num, name = m['name']).delete()
            if Complaint.objects.filter(pk = num).exists():
                Complaint.objects.get(pk = num).delete()

            return HttpResponse(json.dumps({'detail' : 'Произошла ошибка ' + str(error)}, ensure_ascii=False), status = 400)

        return HttpResponse(json.dumps({'detail' : 'ok'}, ensure_ascii=False), status=201)