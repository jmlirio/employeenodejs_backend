import turtle  

turtle.bgcolor("black")

y= turtle.Pen()
y.speed(20)

colors = ['red', 'yellow', 'green', 'blue', 'purple', 'orange']
for x in range(300):
	y.pendown()
	y.pencolor(colors[x%6]) 
	y.width(x/100 + 1) 
	y.forward(x) 
	y.left(59) 
	
y.penup()
turtle.done()