from rest_framework import serializers
from rest_framework.fields import ChoiceField

class SequentialSerializer (serializers.Serializer):
    table = serializers.CharField(required=True)
    column = serializers.CharField(required=True)
    example = serializers.CharField(required=False)  # alfanuméricos
    min = serializers.CharField(required=False)
    max = serializers.CharField(required=False)
    sort = serializers.CharField(required=False)
    # D, M o Y para secuencia de fechas de días, meses o años
    frequency = ChoiceField(choices=['D', 'M', 'Y'], required=False)
