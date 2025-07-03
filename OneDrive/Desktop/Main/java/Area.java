//Area of the rectangle
import java.util.Scanner;
public class Area{
    int length;
    int width;
    Scanner input=new Scanner(System.in);
    void area(){
        System.out.println("length:");
        length=input.nextInt();
        System.out.print("width:");
        width=input.nextInt();
        
    }
    void calculateArea(){
        int area=length*width;
        System.out.print("Area:"+area);
    }

public static void main(String[] args)
{
    Area m=new Area();
    m.area();
    m.calculateArea();
}
}
// next method
// import java.util.Scanner;
// public class Main{
//     public static void main(String[] args)
//     {
//         Scanner input=new Scanner(System.in);
//         System.out.println("Enter the length of the  rectangle:");
//         int length=input.nextInt();
//         System.out.print("Enter the width of the rectangle:");
//         int width=input.nextInt();
//         int Area=length*width;
//         System.out.println("Area:"+Area);
//     }
// }
