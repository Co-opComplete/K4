#include <StandardCplusplus.h>
#include <system_configuration.h>
#include <unwind-cxx.h>
#include <utility.h>
#include <vector>
#include "Message.h"

using namespace std;

//vector<int> test (4);
void setup()
{
  Serial.begin(9600);
}

void loop() 
{
  delay(2000);
  toByteArrayTest();
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
  Serial.print("Testing toByteArray... ");
  Envelope* env = new Envelope(0xD00D);

  byte data[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0x00, 0xDE, 0xAD, 0xBE, 0xEF };
  Message *m = new Message(0x8008, 9, data);
  env->add(m);
  
  byte expected[] = { 0xD0, 0xD, 0xC, 0x80, 0x8, 0x9, 0xDE, 0xAD, 0xBE, 0xEF, 0x0, 0xDE, 0xAD, 0xBE, 0xEF, 0x9F };
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
