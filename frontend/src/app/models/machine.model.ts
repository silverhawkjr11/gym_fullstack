export interface Machine {
  id: number;
  code: string;
  name: string;
  description: string;
  created_at: string;
}

export interface MachineRequest {
  code: string;
  name: string;
  description?: string;
}
