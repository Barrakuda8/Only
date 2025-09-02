interface EventStructure {
  date: string,
  description: string
}

interface MyJsonStructure {
  name: string;
  startDate: number;
  endDate: number,
  events: EventStructure[];
}

declare module "*.json" {
  const value: MyJsonStructure[];
  export default value;
}