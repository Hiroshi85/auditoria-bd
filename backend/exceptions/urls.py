from django.urls import path
from .views import field_view, sequence_view, table_view, custom_view

urlpatterns = [
    path('db/<int:id>/fields', view=field_view.obtain_valores),
    path('db/<int:id>/tables', view=table_view.index),
    path('db/<int:id>/custom', view=custom_view.index),
    path('db/<int:id>/custom/queries/save', view=custom_view.save_query),
    path('custom/queries/<int:id>/delete', view=custom_view.delete_query),
    path('db/<int:id>/custom/queries/get', view=custom_view.get_queries_by_user_id),
    path('db/<int:id>/sequence/numeric', view=sequence_view.integer_sequence_exception),
    path('db/<int:id>/sequence/alphanumeric', view=sequence_view.alphanumeric_sequence_exception),
    path('db/<int:id>/sequence/date', view=sequence_view.date_sequence_exception)
]
