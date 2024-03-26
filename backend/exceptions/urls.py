from django.urls import path
from .views import field_view, sequence_view

urlpatterns = [
    path('db/<int:id>/fields', view=field_view.obtain_valores),
    path('db/<int:id>/sequence/numeric', view=sequence_view.integer_sequence_exception),
    path('db/<int:id>/sequence/alphanumeric', view=sequence_view.alphanumeric_sequence_exception),
    path('db/<int:id>/sequence/date', view=sequence_view.date_sequence_exception)
]
