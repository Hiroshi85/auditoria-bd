from rest_framework import serializers

class CustomExceptionSerializer(serializers.Serializer):
    table = serializers.CharField(required=True)
    query = serializers.CharField(required=True)
    task_name = serializers.CharField(required=True)
    
class QueriesSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=False)
    name = serializers.CharField(required=True)
    query = serializers.CharField(required=True)
    table = serializers.CharField(required=True)
    created_at = serializers.DateTimeField(required=False)
    updated_at = serializers.DateTimeField(required=False)
    only_this_connection = serializers.BooleanField(required=True)