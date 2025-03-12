from django.contrib import admin
from .models import Machine, Directory_Machine, TO, Directory_TO, Complaint, Directory_Complaint, Service_Company

# Register your models here.

admin.site.register(Machine)
admin.site.register(Directory_Machine)
admin.site.register(TO)
admin.site.register(Directory_TO)
admin.site.register(Complaint)
admin.site.register(Directory_Complaint)
admin.site.register(Service_Company)