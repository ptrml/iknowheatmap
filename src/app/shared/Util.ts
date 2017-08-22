export class Util {
  public static round(input:number)
  {
    input = input*100;
    input = Math.round(input);
    return input/100;

  }
}
