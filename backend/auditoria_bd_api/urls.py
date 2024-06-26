from django.urls import path
from .views import bd_view, results_view, completions

urlpatterns = [
    path('test', view=bd_view.test_connection), 
    path('save', view=bd_view.save_connection), 
    path('get/last', view=bd_view.get_last_connection),
    path('get/all', view=bd_view.get_user_connections),
    path('connection/<int:id>/tables', view=bd_view.get_tables),
    path('connection/<int:id>/tables/<slug:name>', view=bd_view.get_table_detail),
    path('connection/<int:id>', view=bd_view.connect_to_db),
    path('results', view=results_view.get_results_by_user),
    path('results/<int:id>', view=results_view.get_result_by_id),
    path('completions/<int:id>', view=completions.get_query_by_prompt),
]
