import serial, struct, time
from pyrobot import Create
from ws4py.client.threadedclient import WebSocketClient

create = Create('/dev/ttyUSB0')
create.safe = False
create.SoftReset()
create.Control()

test_signal = [128]

create.DriveStraight(500)

time.sleep(1)
create.Stop()

#ser = serial.Serial('/dev/ttyUSB0', 57600)

#ser.open()

#ser.write(struct.pack('B' * len(test_signal), *test_signal))

#if __name__ == '__main__':
#    try:
#        ws = K4Client('ws://
