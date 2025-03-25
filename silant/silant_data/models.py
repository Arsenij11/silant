from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class Machine(models.Model):
    factory_number = models.CharField(unique=True, max_length=255, primary_key=True, verbose_name="Номер машины")
    engine_number = models.CharField(max_length=255)
    transmission_number = models.CharField(max_length=255)
    drive_axle_number = models.CharField(max_length=255)
    steerable_bridge_number = models.CharField(max_length=255)
    delivery_contract = models.CharField(max_length=255)
    date_shipment = models.DateTimeField(blank=True)
    customer = models.CharField(max_length=255)
    delivery_address = models.CharField(max_length=255)
    equipment = models.TextField()
    client = models.OneToOneField(User, on_delete=models.CASCADE, null=True, related_name='machine')
    service_company = models.OneToOneField('Service_Company', on_delete=models.CASCADE, related_name='machine', null=True)

    class Meta:
        verbose_name = "Машина"
        verbose_name_plural = "Машины"
    def __str__(self):
        return 'Номер машины ' + self.factory_number

class Directory_Machine(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    model_type = models.CharField(max_length=255, choices=[
        ('machine_model', 'Модель техники'),
        ('engine_model', 'Модель двигателя'),
        ('transmission_model', 'Модель трансмиссии'),
        ('drive_axle_model', 'Модель ведущего моста'),
        ('steerable_bridge_model', 'Модель управляемого моста')
    ])
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='directory')

    def __str__(self):
        return f'Машина: {self.machine.factory_number}\nОбъект описания: {self.model_type}\nНазвание: {self.name}\nОписание: {self.description}'


class TO(models.Model):
    date_TO = models.DateTimeField(auto_now_add=True)
    operating_time = models.IntegerField()
    order_number = models.CharField(max_length=255)
    date_order = models.DateTimeField()
    service_company = models.ForeignKey('Service_Company', on_delete=models.SET_NULL, related_name='TO', null=True)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='TO')

    def __str__(self):
        return f'ТО под номером {self.pk} машины {self.machine.factory_number}'

class Directory_TO(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    num_TO = models.OneToOneField('TO', related_name='directory_to', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Complaint(models.Model):
    date_order = models.DateTimeField(auto_now_add=True)
    operating_time = models.IntegerField()
    refusal_description = models.TextField()
    using_extra_components = models.CharField(max_length=255)
    date_remaining = models.DateTimeField()
    downtime = models.CharField(max_length=255)
    service_company = models.ForeignKey('Service_Company', on_delete=models.SET_NULL, related_name='complaint', null=True)
    machine = models.ForeignKey(Machine, on_delete=models.CASCADE, related_name='complaint')

    def __str__(self):
        return str(self.date_order) + '\t' + self.machine.factory_number

class Directory_Complaint(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    directory_type = models.CharField(max_length=255, choices=[
        ('refusal_node', 'Узел отказа'),
        ('var_remaining', 'Способ восстановления')
    ])
    complaint = models.ForeignKey('Complaint', on_delete=models.CASCADE, related_name='directory_complaint')

    def __str__(self):
        return self.name

class Service_Company(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name
