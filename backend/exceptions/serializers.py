from rest_framework import serializers


class SequentialSerializer (serializers.Serializer):
    table = serializers.CharField(required=True)
    column = serializers.CharField(required=True)
    example = serializers.CharField(required=False)
    min = serializers.CharField(required=False)
    max = serializers.CharField(required=False)
    sort = serializers.CharField(required=False)