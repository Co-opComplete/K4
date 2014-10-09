/*
  SerialController.cpp - Serial implementation for controlling a Rhino Motor
*/
#include <Arduino.h>
#include <SoftwareSerial.h>
#include "SerialController.h"

SerialController::SerialController()
{ }

void SerialController::Attach(int rxPin, int txPin, int baud)
{
  _port = new SoftwareSerial(rxPin, txPin);
  _port->begin(baud);
  EOT = "\n\r";
}

void SerialController::SetMaxSpeed(float value)
{
  if (_port)
  {
    _port->print("M");
    _port->print(String(ConvertValue(value)));
    _port->print(EOT);
  }
}

void SerialController::SetSpeed(float value)
{
   // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("S");
    _port->print(String(ConvertValue(value)));
    _port->print(EOT);
  }
}

void SerialController::SetDamping(float value)
{
   // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("D");
    _port->print(String(ConvertValue(value)));
    _port->print(EOT);
  }
}

void SerialController::SetRelativePosition(long value)
{
     // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("R");
    _port->print(value);
    _port->print(EOT);
  }
}
    
bool SerialController::RestoreDefaults()
{
  bool successful = false;
  
   // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("Y");
    _port->print(EOT);
    successful = true;
  }
 
  return successful;
}

bool SerialController::SetI2cAddress(int address)
{
    bool successful = false;
  
   // check to make sure that the serial port is ready
  if (_port)
  {
    _port->print("E");
    _port->print(address << 1);
    _port->print(EOT);

    successful = true; // mayhaps look into reading back i2c address to confirm
  }
  
  return successful;
}

float SerialController::ReadSpeed()
{
//  int value = 0;
//  int i = 0;
//  
//  if (_port)
//  {
//    while (_port->available())
//    {
//      _port->read();
//    }
//    
//    _port->print("S");
//    _port->print(EOT);
//    _port->flush();
//    
//    Serial.print("ReadSpeed: ");
//    while (_port->available())
//    {
//      Serial.print(_port->read());
//    }
//    Serial.println("");
//
//  }
//  
//  return ConvertValue(value);
}

float SerialController::ReadMaxSpeed()
{
  int value = 0;
  
//  if (_port)
//  {
//    _port->print("M");
//    _port->print("\n\r");
//    
//    while(!_port->available())
//    { delay(10); }
//    
//    while (_port->available())
//    { Serial.print( _port->read());}
//   
//    Serial.println("");   
//  }
  
  return ConvertValue(value);
}

float SerialController::ReadDamping()
{
  int value = 0;
  
//  if (_port)
//  {
//    _port->print("D");
//    _port->print("\n\r");
//    _port->flush();
//    
//    while(!_port->available())
//    { delay(10); }
//    
//    while (_port->available())
//    { Serial.Set( _port->read()); Serial.print("  "); }   
//  }
  
  return ConvertValue(value);
}

long SerialController::ReadPosition()
{
  int value = 0;
  
//  if (_port)
//  {
//    _port->print("P");
//    _port->print("\n\r");
//    
//    while(!_port->available())
//    { delay(10); }
//    
//    while (_port->available())
//    { Serial.print( _port->read()); Serial.print("  "); }   
//    //value = _port->read();
//  }
  
  return ConvertValue(value);
}

void SerialController::SerialDump()
{
  if (_port)
  {
//    while(_port->available())
//    { Serial.print(_port->read()); }
  }
}
