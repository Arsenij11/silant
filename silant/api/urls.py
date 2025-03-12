from django.urls import path, re_path
from . import views

urlpatterns = [
    re_path(r'^get_machine/(?P<factory_number>[\w\W]+)/(?P<token>[\w\W]+)$', views.MachineDetailAPIView.as_view(), name='machine'),
    re_path(r'^get_to/(?P<factory_number>[\w\W]+)$', views.TOAPIView.as_view(), name = 'to'),
    re_path(r'^get_complaint/(?P<factory_number>[\w\W]+)$', views.ComplaintsAPIView.as_view(), name = 'complaint'),
    re_path(r'^get_user_info/(?P<username>[\w\W]+)$', views.AccountInfoAPIView.as_view(), name = 'user'),

    re_path(r'^new_machine$', views.MachineCreateAPIView.as_view(), name = 'new_machine'),
    re_path(r'^new_to$', views.TOCreateAPIView.as_view(), name = 'new_to'),
    re_path(r'^new_complaint$', views.ComplaintCreateAPIView.as_view(), name = 'new_complaint')
]