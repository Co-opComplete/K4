#include <StandardCplusplus.h>
#include <system_configuration.h>
#include <unwind-cxx.h>
#include <utility.h>
#include <vector>
#include "Message.h"

using namespace std;

void setup()
{
  Serial.begin(9600);
}

void loop() 
{
  delay(100);
  toByteArrayTest();
  multiMessageToByteArrayTest();
}

void printBuf(byte* buf, int bufSize)
{
  for(int i = 0; i < bufSize; i++)
  {
    Serial.print("0x"); Serial.print(buf[i], HEX); Serial.print(" ");
  }
  Serial.println();
}

bool isEqual(byte* buf1, int size1, byte* buf2, int size2)
{
  if (size1 != size2)
  { return false; }
  
  for (int i = 0; i < size1; i++)
  {
    if (buf1[i] != buf2[i])
    { return false; }
  }
  
  return true;
}

void toByteArrayTest()
{
  Serial.print("Running toByteArray test... ");
  Envelope* env = new Envelope(0xD00D);

  byte data[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0x00, 0xDE, 0xAD, 0xBE, 0xEF };
  Message *m = new Message(0x8008, 9, data);
  env->add(m);
  
  byte expected[] = { 0xD0, 0x0D, 0x0C, 0x80, 0x08, 0x09, 0xDE, 0xAD, 0xBE, 0xEF, 0x00, 0xDE, 0xAD, 0xBE, 0xEF, 0x9F };
  int expectedSize = 16;
 
  byte* result;
  int resultSize = env->toByteArray(&result);
  
  if (isEqual(expected, expectedSize, result, resultSize))
  { 
    Serial.println(" successful!");
  }
  else 
  { 
    Serial.println(" failed!!!!!"); 
    Serial.print("  Expected: "); printBuf(expected, expectedSize);
    Serial.print("  Result:   "); printBuf(result, resultSize);
  }
  
  delete[] result; // must manually delete any buffers created by toByteArray
  result = NULL;
  delete env;
  env = NULL;
}

void multiMessageToByteArrayTest()
{
  Serial.print("Running multi message toByteArray test... ");
  Envelope* env = new Envelope(0x5E1F);

  byte data1[] = { 0xAA, 0x55, 0xF0, 0x0F, 0x00, 0xFF };
  Message *m = new Message(0xA34E, 6, data1);
  env->add(m);
  
  byte data2[] = { 0x55, 0xAA, 0x0F, 0xF0, 0xFF, 0x00 };
  m = new Message(0xA34E, 6, data2);
  env->add(m);
  
  byte data3[] = { 0x96, 0x69, 0x69, 0x96 };
  m = new Message(0xF154, 4, data3);
  env->add(m);
  
  byte data4[] = { 0x69, 0x96, 0x96, 0x69 };
  m = new Message(0xF154, 4, data4);
  env->add(m);
  
  byte expected[] = { 0x5E, 0x1F, 0x20, 0xA3, 0x4E, 0x06, 0xAA, 0x55, 0xF0, 0x0F, 0x00, 0xFF, 0xA3, 0x4E, 0x06, 0x55, 0xAA, 0x0F, 0xF0, 0xFF, 0x00, 0xF1, 0x54, 0x04, 0x96, 0x69, 0x69, 0x96, 0xF1, 0x54, 0x04, 0x69, 0x96, 0x96, 0x69, 0xFD };
  int expectedSize = 36;
 
  byte* result;
  int resultSize = env->toByteArray(&result);
  
  if (isEqual(expected, expectedSize, result, resultSize))
  { 
    Serial.println(" successful!");
  }
  else 
  { 
    Serial.println(" failed!!!!!"); 
    Serial.print("  Expected: "); printBuf(expected, expectedSize);
    Serial.print("  Result:   "); printBuf(result, resultSize);
  }
  
  delete[] result; // must manually delete any buffers created by toByteArray
  result = NULL;
  delete env;
  env = NULL;
}
