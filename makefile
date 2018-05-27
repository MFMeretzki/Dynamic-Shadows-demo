prog: demo.o vbotorus.o vboteapot.o
	g++ -Wall -std=c++11 -o prog demo.o vbotorus.o vboteapot.o -lGL -lglut -lGLU -lGLEW 

demo.o: demo.cpp
	g++ -Wall -std=c++11 -c demo.cpp

vbotorus.o: vbotorus.cpp
	g++ -Wall -std=c++11 -c vbotorus.cpp

vboteapot.o: vboteapot.cpp
	g++ -Wall -std=c++11 -c vboteapot.cpp

clean:
	rm -f *.o prog

exe: prog
	./prog
