#include<stdio.h>
#define MAX 5
int stack[MAX],top=-1;
//function to chake if the stack is empty
int isEmpty()
    {
        return top==-1;
    }
    //function tochake of the stack is full
    int isFull(){
        return top==MAX-1;
    }
    //push operation
    void push(int value){
        if(isFull())
        printf("stack overflow ! cannot push %d\n",value);
        else{
            stack[++top]=value;
            printf("%d pushed to the stack\n",value);
        }
    }
    //pop operation
    int pop(){
        if(isEmpty()){
            printf("stack underflow! no element to pop");
            return -1;
        }
        return stack[top--];
        }
        //peek operation
        int peek(){
            if(isEmpty()){
                printf("stack is empty ! not top element\n");
                return -1;
                
            }
            return stack[top];
        }
        //display stack element
        void display(){
            if(isEmpty()){
                printf("stack is empty\n");
                return;
                
            }
            printf("stack element");
            for(int i=top;i>=0;i--)
            printf("%d",stack[i]);
            printf("\n");
            
        }
        int main(){
            int choice,value;
            while(1){
                printf("\t\tImplementation of different operaations related to stack\n");
                printf("\n1.push\n2.pop\n3.peek\n4.Display\n5.chake if full\n6.chake if empty\n7.Exit\n");
                printf("\n");
                printf("Enter the choice:");
                scanf("%d",&choice);
                switch(choice){
                    case 1:
                    printf("Enter value to push:");
                    scanf("%d",&value);
                    push(value);
                    break;
                    case 2:
                    printf("%d popped from the stack\n",pop());
                    break;
                    case 3:
                    printf("top element :%d\n",peek());
                    break;
                    case 4:
                    display();
                    break;
                    case 5:
                    printf(isFull()?"stack is full":"stack is not full");
                    break;
                    case 6:
                    printf(isEmpty()?"stack is empty":"stack is not empty");
                    break;
                    case 7:
                    return 0;
                    default:
                    printf("invalid choice ! please enter the valid choice:");
                }
            }
        }
