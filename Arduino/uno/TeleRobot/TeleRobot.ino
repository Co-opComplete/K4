#include <Wire.h>
#include <SoftwareSerial.h>
#include "IDrive.h"
#include "IMotorController.h"
#include "SerialController.h"
#include "I2cController.h"
#include "Mecanum.h"
#include "Vector.h"
#include "Status.h"

#define SERIAL_ENABLE  2
#define SERIAL_1       8
#define SERIAL_2       12

#define SERIAL_RX      4
#define SERIAL_TX      7

#define PI_SERIAL_RX   9
#define PI_SERIAL_TX   10

#define A_I2C_ADDRESS 0x0A
#define B_I2C_ADDRESS 0x0B
#define C_I2C_ADDRESS 0x0C
#define D_I2C_ADDRESS 0x0D

#define BUF_SIZE       100
#define CMD_BUF_SIZE   BUF_SIZE * 2
#define MSG_SIZE       31

#define LED_PIN        13

I2cController *MA = new I2cController();
I2cController *MB = new I2cController();
I2cController *MC = new I2cController();
I2cController *MD = new I2cController();
Mecanum robot;

//SoftwareSerial *pi;

Vector *translation;
float rotation = 0.0f;

char readBuf[BUF_SIZE];
int readBufCount = 0;

char remainingBytes[BUF_SIZE];
int remainingBytesCount = 0;

char cmdBuf[CMD_BUF_SIZE];
int cmdBytesCount = 0;
int cmdBytePosition = 0;

void setup() 
{
  Serial.begin(9600);
  
  delay(1000);
  Configure();
  delay(1000);
 
  MA->Attach(A_I2C_ADDRESS);
  MB->Attach(B_I2C_ADDRESS);
  MC->Attach(C_I2C_ADDRESS);
  MD->Attach(D_I2C_ADDRESS);
  robot.Attach(MA, MB, MC, MD);
  
  //demo();
  
  pinMode(LED_PIN, OUTPUT);
  
  if (Serial)
  {
    while(Serial.available())
    { Serial.read(); }
  }
}

void demo()
{
  Serial.println("Running demo...");
  while (true)
  {
    delay(1000);
    Serial.println("Forward");
    translation = new Vector(0.0f, 0.6f);
    robot.Move(*translation, rotation);
    delay(1000);
    
    Serial.println("Stop");
    translation = new Vector(0.0f, 0.0f);
    robot.Move(*translation, rotation); // maybe we need a stop command?
    delay(1000);
    
    Serial.println("Backwards");
    translation = new Vector(PI, 0.6f);
    robot.Move(*translation, rotation);
    delay(1000);
    
    Serial.println("Stop");
    translation = new Vector(0.0f, 0.0f);
    robot.Move(*translation, rotation); // maybe we need a stop command?
    delay(1000);
    
    Serial.println("Strafe Left");
    translation = new Vector(PI/2, 0.6f);
    robot.Move(*translation, rotation);
    delay(1000);
    
    Serial.println("Stop");
    translation = new Vector(0.0f, 0.0f);
    robot.Move(*translation, rotation); // maybe we need a stop command?
    delay(1000);
    
    Serial.println("Strafe Right");
    translation = new Vector(3*PI/2, 0.6f);
    robot.Move(*translation, rotation);
    delay(2000);
    
    Serial.println("Stop");
    translation = new Vector(0.0f, 0.0f);
    robot.Move(*translation, rotation); // maybe we need a stop command?
    delay(1000);
    
    Serial.println("Strafe Left");
    translation = new Vector(PI/2, 0.6f);
    robot.Move(*translation, rotation);
    delay(1000);
    
    Serial.println("Stop");
    translation = new Vector(0.0f, 0.0f);
    robot.Move(*translation, rotation); // maybe we need a stop command?
    delay(1000);
    
    Serial.println("Arc");
    translation = new Vector(PI/2, 0.6f);
    rotation = 0.1f;
    robot.Move(*translation, rotation); // maybe we need a stop command?
    delay(4000);
    
    rotation = 0.0f;
    
    Serial.println("Stop");
    translation = new Vector(0.0f, 0.0f);
    robot.Move(*translation, rotation); // maybe we need a stop command?
    delay(4000);
  }
}

void loop() 
{
//  if (Serial.available() > 0)
//  {
//    Serial.print("Recieved: ");
//    while (Serial.available() > 0
//    )
//    { Serial.write(Serial.read()); }
//  }
//  else
//  { delay(250); }
  
  if (Serial.available() <= 0)
  { delay(250); } // wait a 250 ms before checking for commands again
  else
  {
//    digitalWrite(LED_PIN, HIGH);
//    delay(50);
//    digitalWrite(LED_PIN, LOW);
//    delay(50);

    cmdBytesCount = 0; // initialize to 0
    readBufCount = Serial.readBytes(readBuf, BUF_SIZE);
    
//    Serial.print("Received "); Serial.print(readBufCount); Serial.println(" bytes from the PI");
//    Serial.print("Recieved Data: ");
//    for (int i = 0; i < readBufCount; i++)
//    {
//      Serial.print(readBuf[i]);
//    }
//    Serial.println(); Serial.println();
    
    // copy left over bytes from last read over to the command buffer
    if (remainingBytesCount > 0)
    {
      memcpy(cmdBuf, remainingBytes, remainingBytesCount);
      cmdBytesCount += remainingBytesCount;
      remainingBytesCount = 0;
    }
    
    // copy new bytes read to the command buffer
    if (readBufCount > 0)
    {
      memcpy(cmdBuf + cmdBytesCount, readBuf, readBufCount);
      cmdBytesCount += readBufCount;
      readBufCount = 0;
      cmdBytePosition = -1; // initialize to -1, this will be used to determine if a message exists
    }
    
    // find commands
    if (cmdBytesCount >= MSG_SIZE)
    {
      // Check to see if the buffer starts with a command.
      if (cmdBuf[0] == '#' && cmdBuf[MSG_SIZE - 1] == ';')
      { cmdBytePosition = 0; } // buffer starts with a message
      else
      {
        // search for message start
        for (int i = 0; i < cmdBytesCount; i++)
        {
          if (cmdBuf[i] == '#' &&                 // Starts with message header
              cmdBytesCount - i >= MSG_SIZE &&    // There is enough data that a message could be present
              cmdBuf[i + MSG_SIZE - 1] == ';')    // Ends with the message footer
          {
            // We are now aligned
            cmdBytePosition = i;
            break;
          }
        }
      }
      
      if (cmdBytePosition != -1)
      {
        while(cmdBytePosition + MSG_SIZE <= cmdBytesCount)
        {
          /* Message Format:
          // #Magnitude,Angle,+/-RotationRate,+/-Tilt;
          //
          // Magnitude ranges 0 -> 1 and is a floating point value with 4 digits of precision
          // Angle ranges from 0 -> 2*PI with 4 digits of precision
          // Rotation Rate ranges from -1 -> 1 with 4 digits of precision
          // Tilt ranges -1 -> 1 with 4 digits of precision
          */
          
          // TODO: Better validation
          char magnitudeArray[7];
          char angleArray[7];
          char rotationArray[8];
          char tiltArray[8];
          
          char message[MSG_SIZE + 1];
          memcpy(message, cmdBuf + cmdBytePosition, MSG_SIZE);
          message[MSG_SIZE] = '\0';
          
          Serial.print("Message: "); Serial.print(message); Serial.println();
          
          memcpy(magnitudeArray, cmdBuf + cmdBytePosition +  1,  6); // skip the #
          memcpy(angleArray,     cmdBuf + cmdBytePosition +  8,  6); // skip the comma
          memcpy(rotationArray,  cmdBuf + cmdBytePosition + 15,  7); // skip the comma
          memcpy(tiltArray,      cmdBuf + cmdBytePosition + 23,  7); // skip the comma
          
          // null terminate char arrays
          magnitudeArray[6] = '\0';
          angleArray[6] = '\0';
          rotationArray[7] = '\0';
          tiltArray[7] = '\0';
          
//          Serial.print("Magnitude Char Array: "); Serial.println(magnitudeArray);
//          Serial.print("Angle Char Array: "); Serial.println(angleArray);
//          Serial.print("Rotation Char Array: "); Serial.println(rotationArray);
//          Serial.print("Tilt Char Array: "); Serial.println(tiltArray);
//          Serial.println();
//          
          float magnitude = atof(magnitudeArray);
          float angle = atof(angleArray);
          float rotation = atof(rotationArray);
          float tilt = atof(tiltArray);
          
          Serial.print("Magnitude: "); Serial.println(magnitude);
          Serial.print("Angle: "); Serial.println(angle);
          Serial.print("Rotation: "); Serial.println(rotation);
          Serial.print("Tilt: "); Serial.println(tilt);
          Serial.println();
          
           cmdBytePosition += MSG_SIZE;
          
           translation = new Vector(angle, magnitude);
           robot.Move(*translation, rotation);
        }
      }
  
      // save remaining bytes
      if (cmdBytePosition + 1 < cmdBytesCount)
      {
        remainingBytesCount = cmdBytesCount - (cmdBytePosition + 1);
        memcpy(remainingBytes, cmdBuf + cmdBytePosition + 1, remainingBytesCount);
      }
    }
  }
}

void Configure()
{
  Serial.println();
  Serial.println("Configuring motors...");
  // Set Software Serial Pins to output mode
  pinMode(SERIAL_RX, OUTPUT);
  pinMode(SERIAL_TX, OUTPUT);
  pinMode(SERIAL_ENABLE, OUTPUT);
  pinMode(SERIAL_1, OUTPUT);
  pinMode(SERIAL_2, OUTPUT);
  
  // Configure all pins to default to low
  // this seems to prevent the motors from
  // getting confused.
  digitalWrite(SERIAL_RX, LOW);
  digitalWrite(SERIAL_TX, LOW);
  digitalWrite(SERIAL_ENABLE, LOW); // turn on serial port switching
  digitalWrite(SERIAL_1, LOW);
  digitalWrite(SERIAL_2, LOW);
  
  SerialController sc;
  
  sc.Attach(SERIAL_RX,SERIAL_TX, 9600);
  
//  Serial.println("Configuring motors...");
  
  SelectMotorSerial(A_I2C_ADDRESS);
  sc.SetSpeed(0.0f);
  sc.RestoreDefaults();
  sc.SetI2cAddress(A_I2C_ADDRESS);
  sc.SetDamping(0.3f);
  sc.SetMaxSpeed(1.0f);
  
  SelectMotorSerial(B_I2C_ADDRESS);
  sc.SetSpeed(0.0f);
  sc.RestoreDefaults();
  sc.SetI2cAddress(B_I2C_ADDRESS);
  sc.SetDamping(0.3f);
  sc.SetMaxSpeed(1.0f);
  
  SelectMotorSerial(C_I2C_ADDRESS);
  sc.SetSpeed(0.0f);
  sc.RestoreDefaults();
  sc.SetI2cAddress(C_I2C_ADDRESS);
  sc.SetDamping(0.3f);
  sc.SetMaxSpeed(1.0f);
  
  SelectMotorSerial(D_I2C_ADDRESS);
  sc.SetSpeed(0.0f);
  sc.RestoreDefaults();
  sc.SetI2cAddress(D_I2C_ADDRESS);
  sc.SetDamping(0.3f);
  sc.SetMaxSpeed(1.0f);

  // turn off serial port switching
  digitalWrite(SERIAL_ENABLE, HIGH);
}

// we need an identifier for the motors
void SelectMotorSerial(int i2cAddress)
{
  switch(i2cAddress)
  {
    case A_I2C_ADDRESS:
      digitalWrite(SERIAL_1, LOW);
      digitalWrite(SERIAL_2, LOW);
      break;
    case B_I2C_ADDRESS:
      digitalWrite(SERIAL_1, LOW);
      digitalWrite(SERIAL_2, HIGH);
      break;
    case C_I2C_ADDRESS:
      digitalWrite(SERIAL_1, HIGH);
      digitalWrite(SERIAL_2, LOW);
      break;
    case D_I2C_ADDRESS:
      digitalWrite(SERIAL_1, HIGH);
      digitalWrite(SERIAL_2, HIGH);
      break;       
  }
}
