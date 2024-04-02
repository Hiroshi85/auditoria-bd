from rest_framework import serializers

class DBConnectionSerializer (serializers.Serializer):
    engine = serializers.CharField(required=True)
    name = serializers.CharField(required=True)
    host = serializers.CharField(required=True)
    port = serializers.IntegerField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(allow_blank=True, required=True)

class DBResultSerializer (serializers.Serializer):
    table = serializers.CharField(required=True)
    results = serializers.CharField(required=True)
    connection = serializers.IntegerField(required=True)
    exception_type = serializers.IntegerField(required=True)
    created_at = serializers.DateTimeField(required=False)