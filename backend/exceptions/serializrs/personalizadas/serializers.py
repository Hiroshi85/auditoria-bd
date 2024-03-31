from rest_framework import serializers

class CustomExceptionSerializer(serializers.Serializer):
    table = serializers.CharField(required=True)
    query = serializers.CharField(required=True)
    task_name = serializers.CharField(required=True)
    