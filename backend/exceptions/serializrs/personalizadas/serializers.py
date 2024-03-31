from rest_framework import serializers

class CustomExceptionSerializer(serializers.Serializer):
    table = serializers.CharField(required=True)
    columns = serializers.CharField(required=True)
    conditions = serializers.CharField(required=False, allow_blank=True)
    task_name = serializers.CharField(required=True)
    