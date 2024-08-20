from django import template

register = template.Library()


@register.filter
def get_dict_value(dictionary, args):
    arg_list = [arg.strip() for arg in args.split(',')]
    if arg_list[0] in dictionary:
        return dictionary.get(arg_list[0])
    if len(arg_list) > 1:
        return arg_list[1]
    return ''
