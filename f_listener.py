#!/usr/bin/env python
# coding: utf-8

#!/usr/bin/env python
import socket
import json
import time
import struct
import sys
import math

IPSource = ''
IPControl  = '128.122.215.23'
TCPControl = 20010
sourcePort = 0
username = "Testuser"
password = "Testpassword"
BUFFER_SIZE = 1024

message = '{"function":"auth","username":"'+username+'","password":"'+password+'"}'
message = message.encode()
   
try:                                                    # First try-except block -- create socket
   s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
except socket.error as e:
   print ("Error creating socket: %s" % e)
   sys.exit(1)

   
try:                                                  # Second try-except block -- connect to given host/port
   s.connect((IPControl, TCPControl))
except socket.gaierror as e:
   print ("Address-related error connecting to server: %s" % e)
   sys.exit(1)
except socket.error as e:
   print ("Connection error: %s" % e)
   sys.exit(1)

   
try:                                                   # Third try-except block -- sending data
   print("Authenticating...")
   p = s.send(('{"function":"auth","username":"'+username+'","password":"'+password+'"}').encode())
   print(p)
except socket.error as e:
   print ("Error sending data: %s" % e)
   sys.exit(1)

   
try:         
   data = s.recv(BUFFER_SIZE)
   token = json.loads(data.decode("utf-8"))['token']
   print(token)
   IPSource = json.loads(data.decode("utf-8"))['ip']
   print(IPSource)
    # Original Sender
   s.send(('{"function":"receiver","workspace":"Holodeck","proto":"udp","ip":"'+str(IPSource)+'","port":0,"echo":true,"alert":true,"type":["3d"],"token":"'+token+'"}').encode())
   # Iqra
#    s.send(('{"function":"receiver","workspace":"Holodeck","proto":"udp","ip":"'+str(IPSource)+'","echo":true,"alert":true,"type":"3d","token":"'+token+'"}').encode())
   data = s.recv(BUFFER_SIZE)
   print(data)
   streamid=json.loads(data.decode("utf-8"))['streamid']
   port=int(json.loads(data.decode("utf-8"))['port'])
   print(streamid)
except socket.error as e:
   print ("Error receiving data: %s" % e)
   sys.exit(1)  

udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
serverAddress = (IPControl, port)


def sendMessage(message):
   print(message)
   t = format(int(time.time()*1000), 'n')
   header = {
       "id" : streamid,
       "time" : t
   }
   header=json.dumps(header,separators=(',', ':')).encode()
   header_size=len(header)
   data=message.encode()
   data_size=len(data)
   header_size=struct.pack('H',header_size)
   data_size=struct.pack('I',data_size)
   udp.sendto(header_size+data_size+header+data,serverAddress)

time.sleep(1)

try:
   sendMessage(str(0))
   while True:
      # TODO: Listen for new TCP connections
      # (async)
      # data = s.recv(BUFFER_SIZE)
      received = udp.recvfrom(BUFFER_SIZE)
      print(received)
except KeyboardInterrupt:
   print("interrupt received")
finally:
   s.send(('{"function":"disconnect","streamid":"'+streamid+'","token":"'+token+'"}').encode())    
   s.close() 
   print('Done')



# In[ ]: