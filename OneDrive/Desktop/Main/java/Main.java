//check whether the given number is even or odd
import java.util.Scanner;
public class Main{
    public static void main(String[] args)
    {
        Scanner input=new Scanner(System.in);
        System.out.print("Enter hte number:");
        int n=input.nextInt();
         if(n<0){
             System.out.println("Enter posative number");
             
         }
         if(n%2==0)
         {
             System.out.println(n+"is even");
         }else
         {
             System.out.println(n+"is odd");
         }
    }
}