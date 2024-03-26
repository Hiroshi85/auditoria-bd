from django.urls import path
from .views import field_view, sequence_view

urlpatterns = [
    path('db/<int:id>/fields', view=field_view.obtain_valores),
    path('db/<int:id>/sequence', view=sequence_view.sequence_exception),
]
