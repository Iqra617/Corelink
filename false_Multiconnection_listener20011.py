#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import socket


host  = '127.0.0.1'
port = 20010

'''
IPSource = ''
sourcePort = 0
username = "Testuser"
password = "Testpassword"
BUFFER_SIZE = 1024

'''

#ACCEPT WRAPPER

def accept_wrapper(sock):
    conn, addr = sock.accept()  # Should be ready to read
    print('accepted connection from', addr)
    conn.setblocking(False)
    data = types.SimpleNamespace(addr=addr, inb=b'', outb=b'')
    events = selectors.EVENT_READ | selectors.EVENT_WRITE
    sel.register(conn, events, data=data)
    
def service_connection(key, mask):
    sock = key.fileobj
    data = key.data
    if mask & selectors.EVENT_READ:
        recv_data = sock.recv(1024)  # Should be ready to read
        if recv_data:
            data.outb += recv_data
        else:
            print('closing connection to', data.addr)
            sel.unregister(sock)
            sock.close()
    if mask & selectors.EVENT_WRITE:
        if data.outb:
            print('echoing', repr(data.outb), 'to', data.addr)
            sent = sock.send(data.outb)  # Should be ready to write
            data.outb = data.outb[sent:]
            
    
import selectors
sel = selectors.DefaultSelector()
# ...
lsock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
lsock.bind((host, port))
lsock.listen()
print('listening on', (host, port))
lsock.setblocking(False)
sel.register(lsock, selectors.EVENT_READ, data=None)


    
#EVENT LOOP
import selectors
sel = selectors.DefaultSelector()

# ...

while True:
    events = sel.select(timeout=None)
    for key, mask in events:
        if key.data is None:
            accept_wrapper(key.fileobj)
        else:
            service_connection(key, mask)
            
events = selectors.EVENT_READ | selectors.EVENT_WRITE


if recv_data:
    data.outb += recv_data
else:
    print('closing connection to', data.addr)
    sel.unregister(sock)
    sock.close()
    
data.outb = data.outb[sent:]


# In[ ]:




