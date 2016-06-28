#-*- coding:utf8 -*-

class Router(object):
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'netopo':
            return 'netopo'
        elif model._meta.app_label == 'cable':
            return 'cable'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'netopo':
            return 'netopo'
        elif model._meta.app_label == 'cable':
            return 'cable'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'netopo' or \
           obj2._meta.app_label == 'netopo':
            return True
        elif obj1._meta.app_label == 'cable' or \
           obj2._meta.app_label == 'cable':
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if db == 'cable':
            return app_label == 'cable'
        
        elif db == 'netopo':
            return app_label == 'netopo'

        elif db == 'default':
            if app_label in ['cable', 'netopo']:
                return False
            return True
        
        return False