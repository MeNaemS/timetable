from django.db import models
from datetime import datetime

# Change the column names based on your database as well as the table name
class TimeTable(models.Model):
    id = models.IntegerField(db_column='id', unique=True, null=False, primary_key=True)
    Number = models.IntegerField(db_column='number', unique=False, null=True)
    Number_of_p_p = models.TextField(db_column='number of p/p', unique=False, null=True)
    Service = models.TextField(db_column='service', unique=False, null=True)
    Name_of_the_unit = models.TextField(db_column='name of the unit to be serviced', unique=False, null=True)
    Work_performed = models.IntegerField(db_column='work performed as part of maintenance and repair work', unique=False, null=True)
    Time = models.TextField(db_column='time', unique=False, null=False)
    January = models.TextField(db_column='january', unique=False, null=True)
    February = models.TextField(db_column='february', unique=False, null=True)
    March = models.TextField(db_column='march', unique=False, null=True)
    April = models.TextField(db_column='april', unique=False, null=True)
    May = models.TextField(db_column='may', unique=False, null=True)
    June = models.TextField(db_column='june', unique=False, null=True)
    July = models.TextField(db_column='july', unique=False, null=True)
    August = models.TextField(db_column='august', unique=False, null=True)
    September = models.TextField(db_column='september', unique=False, null=True)
    October = models.TextField(db_column='october', unique=False, null=True)
    November = models.TextField(db_column='november', unique=False, null=True)
    December = models.TextField(db_column='december', unique=False, null=True)
    Place = models.TextField(db_column='place', unique=False, null=True)
    Object = models.TextField(db_column='object', unique=False, null=False)
    Place_of_object = models.TextField(db_column='place of object', unique=False, null=False)
    Name = models.TextField(db_column='name', unique=False, null=False)

    class Meta:
        managed = False
        db_table = 'main_timetable'
