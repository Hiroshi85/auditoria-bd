from rest_framework import serializers


class SequentialSerializer (serializers.Serializer):
    table = serializers.CharField(required=True)
    column = serializers.CharField(required=True)
    example = serializers.CharField(required=False)
    min = serializers.IntegerField(required=False)
    max = serializers.IntegerField(required=False)
    sort = serializers.CharField(required=False)