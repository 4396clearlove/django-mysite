#-*- coding:utf8 -*-
import __builtin__

def print_hello():
	print "hello, world"

__builtin__.__dict__['hello'] = print_hello

print_hello() # 将打印"hello, world"
hello() # 将打印"hello, world"