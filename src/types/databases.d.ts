interface EventStructure {
  date: string,
  description: string
}

interface MyJsonStructure {
  name: string;
  startDate: string;
  endDateL: string,
  events: EventStructure[];
}

declare module "*.json" {
  const value: MyJsonStructure[];
  export default value;
}