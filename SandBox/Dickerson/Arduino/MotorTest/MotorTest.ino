#include <Wire.h>
#include <SoftwareSerial.h>
#include "IRhinoMotorController.h"
#include "I2cRhinoMotorController.h"
#include "SerialRhinoMotorController.h"
#include "IRhinoMotorController.h"

#define I2C_ADDRESS_M1     0x0A
#define I2C_ADDRESS_M2     0x0B
#define I2C_ADDRESS_M3     0x0C
#define I2C_ADDRESS_M4     0x0D
#define SERIAL_RX_PIN      8
#define SERIAL_TX_PIN      9


SerialController serialMotor1;
I2cController i2cM1;
I2cController i2cM2;
I2cController i2cM3;
I2cController i2cM4;
IRhinoMotorController *m1;
IRhinoMotorController *m2;
IRhinoMotorController *m3;
IRhinoMotorController *m4;

int value = 0;
bool toggle = false;

void setup()
{
  // Make sure the serial pins always start out low
  // This allows us to have both serial and i2c lines
  // connected to the motor.
  pinMode(SERIAL_RX_PIN, OUTPUT);
  digitalWrite(SERIAL_RX_PIN, LOW);
  pinMode(SERIAL_TX_PIN, OUTPUT);
  digitalWrite(SERIAL_TX_PIN, LOW);
  
  // Set up serial for feedback
  Serial.begin(9600);
  
  //SetupSerial();
  SetupI2c();
}

void loop()
{
  //SetupSerial();
  RunMotorTest();
}

void SetupSerial()
{
  serialMotor1.Attach(SERIAL_RX_PIN, SERIAL_TX_PIN, 9600);

  // Serial specific commands
  serialMotor1.RestoreDefaults();
  serialMotor1.WriteI2cAddress(I2C_ADDRESS_M4);
  
  m1 = &serialMotor1;
  StopMotors();
  
  delay(3000);
}

void SetupI2c()
{
  i2cM1.Attach(I2C_ADDRESS_M1);
  i2cM2.Attach(I2C_ADDRESS_M2);
  i2cM3.Attach(I2C_ADDRESS_M3);
  i2cM4.Attach(I2C_ADDRESS_M4);
  
  m1 = &i2cM1;
  m2 = &i2cM2;
  m3 = &i2cM3;
  m4 = &i2cM4;
  
  StopMotors();
}

void StopMotors()
{
    m1->WriteDamping(50);
    m1->WriteDamping(50);
    m2->WriteSpeed(0);
    m2->WriteSpeed(0);
    m3->WriteDamping(50);
    m3->WriteSpeed(0);
    m4->WriteDamping(50);
    m4->WriteSpeed(0);
    
    delay(3000); // give them time to slow down to a complete stop
}

void RunMotorTest()
{
  if (toggle)
  {
    m1->WriteMaxSpeed(20);
    m4->WriteMaxSpeed(20);
    Serial.print("New Max speed: ");
    Serial.println(m1->ReadMaxSpeed());
  }
  else
  {
    m1->WriteMaxSpeed(255);
    m4->WriteMaxSpeed(255);
    Serial.print("New Max speed: ");
    Serial.println(m1->ReadMaxSpeed());
  }
  
  toggle = !toggle;
  
  for (int i = 0; i < 10; i++)
  {
    m1->WriteRelativePosition(20);
    m4->WriteRelativePosition(20);
    delay(500);
    
    Serial.print("Motor position: ");
    Serial.print(m1->ReadPosition());
    Serial.println(".");
  }
  m1->WriteDamping(255);
  m1->WriteSpeed(255);
  m4->WriteDamping(255);
  m4->WriteSpeed(-255);
  Serial.print("Motor speed: ");
  Serial.print(m1->ReadSpeed());
  Serial.println(".");
  delay(2000);
  
  m1->WriteDamping(50);
  m4->WriteDamping(50);
  Serial.print("Motor Damping: ");
  Serial.println(m1->ReadDamping());
  m1->WriteSpeed(0);
  m4->WriteSpeed(0);
  delay(2000);
  
  m1->WriteDamping(100);
  m4->WriteDamping(100);
  Serial.print("Motor Damping: ");
  Serial.println(m1->ReadDamping());
  m1->WriteSpeed(-255);
  m4->WriteSpeed(255);
  delay(2000);
  
  m1->WriteDamping(50);
  m1->WriteSpeed(0);
  m4->WriteDamping(50);
  m4->WriteSpeed(0);
  delay(2000);

}
