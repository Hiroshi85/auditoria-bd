from rest_framework import serializers
from rest_framework.fields import ChoiceField

class SequentialSerializer (serializers.Serializer):
    table = serializers.CharField(required=True)
    column = serializers.CharField(required=True)
    step = serializers.IntegerField(required=False)
    sort = serializers.CharField(required=False)

class IntegerSequentialSerializer (SequentialSerializer):
    min = serializers.IntegerField(required=False)
    max = serializers.IntegerField(required=False)

class StringSequencialSerializer (SequentialSerializer):
    example = serializers.CharField(required=True)
    static = serializers.BooleanField(required=True)    
    min = serializers.CharField(required=False)
    max = serializers.CharField(required=False)


class DateSequencialSerializer (SequentialSerializer):
    # fechas 
    # D (días), W (semanas)
    # ME (fin de mes), MS(inicio de mes) 
    # YE(fin de año), YS(inicio de año)
    frequency_options = ['D', 'W', 'ME', 'MS', 'YE', 'YS'] 
    frequency = ChoiceField(choices=frequency_options, required=False)
    min = serializers.CharField(required=False)
    max = serializers.CharField(required=False)

