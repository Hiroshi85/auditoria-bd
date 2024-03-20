from rest_framework import serializers

class DBConnectionSerializer (serializers.Serializer):
    engine = serializers.CharField(required=True)
    name = serializers.CharField(required=True)
    host = serializers.CharField(required=True)
    port = serializers.IntegerField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(allow_blank=True, required=True)