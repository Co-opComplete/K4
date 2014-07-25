/*
  RhinoMotorControllerUart.h - Serial implementation for controlling a Rhino Motor
*/
#include <Arduino.h>
//#include <HardwareSerial.h>
#include <SoftwareSerial.h>
#include "I2cRhinoMotorController.h"
#include "SerialRhinoMotorController.h"

SerialController::SerialController()
{ }

//void SerialController::Attach(HardwareSerial& port, int baud)
void SerialController::Attach(int rxPin, int txPin, int baud)
{
//  _port = port;
  _port = new SoftwareSerial(rxPin, txPin);
  _port->begin(baud);
}

void SerialController::WriteMaxSpeed(int value)
{
  if (_port)
  {
    _port->print("M");
    _port->print(value);
    _port->print("\n\r");
  }
}

void SerialController::WriteSpeed(int value)
{
   // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("S");
    _port->print(value);
    _port->print("\n\r");
  }
}

void SerialController::WriteDamping(int value)
{
   // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("D");
    _port->print(value);
    _port->print("\n\r");
  }
}

void SerialController::WriteRelativePosition(long value)
{
     // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("R");
    _port->print(value);
    _port->print("\n\r");
  }
}
    
bool SerialController::RestoreDefaults()
{
  bool successful = false;
  
   // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("Y\n\r");
    successful = true;
  }
 
  return successful;
}

bool SerialController::WriteI2cAddress(int address)
{
    bool successful = false;
  
   // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("E");
    _port->print(address);
    _port->print("\n\r");
    successful = true; // mayhaps look into reading back i2c address to confirm
  }
  
  return successful;
}

int SerialController::ReadSpeed()
{
  int value = 0;
  char buf[20];
  int i = 0;
  
  if (_port)
  {
    while (_port->available())
    {
      _port->read();
    }
    
    _port->print("S");
    _port->print("\n\r");
    _port->flush();
    
    Serial.print("ReadSpeed: ");
    while (_port->available())
    {
      Serial.write(_port->read());
    }
    Serial.println("");

  }
  
  return value;
}

int SerialController::ReadMaxSpeed()
{
  int value = 0;
  
  if (_port)
  {
    _port->print("M");
    _port->print("\n\r");
    
    while(!_port->available())
    { delay(10); }
    
    while (_port->available())
    { Serial.print( _port->read());}
   
    Serial.println("");   
  }
  
  return value;}

int SerialController::ReadDamping()
{
  int value = 0;
  
  if (_port)
  {
    _port->print("D");
    _port->print("\n\r");
    _port->flush();
    
    while(!_port->available())
    { delay(10); }
    
    while (_port->available())
    { Serial.write( _port->read()); Serial.print("  "); }   
  }
  
  return value;}

long SerialController::ReadPosition()
{
  int value = 0;
  
  if (_port)
  {
    _port->print("P");
    _port->print("\n\r");
    
    while(!_port->available())
    { delay(10); }
    
    while (_port->available())
    { Serial.print( _port->read()); Serial.print("  "); }   
    //value = _port->read();
  }
  
  return value;
}
