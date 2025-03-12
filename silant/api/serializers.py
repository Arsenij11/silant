from rest_framework import serializers

from silant_data.models import Machine, Directory_Machine, TO


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = '__all__'


class MachineDirectorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Directory_Machine
        fields = '__all__'


class TOInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TO
        fields = '__all__'