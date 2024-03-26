from rest_framework import serializers
from rest_framework.fields import ChoiceField

class SequentialSerializer (serializers.Serializer):
    table = serializers.CharField(required=True)
    column = serializers.CharField(required=True)
    min = serializers.CharField(required=False)
    max = serializers.CharField(required=False)
    step = serializers.IntegerField(required=False)
    sort = serializers.CharField(required=False)

    # alfanuméricos
    example = serializers.CharField(required=False) 
    static = serializers.BooleanField(required=False) # letras estáticas en la secuencia

    # fechas 
    # D (días)  
    # ME (fin de mes), MS(inicio de mes) 
    # YE(fin de año), YS(inicio de año)
    frequency_options = ['D', 'ME', 'MS', 'YE', 'YS'] 
    frequency = ChoiceField(choices=frequency_options, required=False)
