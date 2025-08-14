import { AddDivisionModal } from "@/components/modules/Admin/Division/AddDivisionModal";

export default function AddDivision() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Divisions</h1>
        <AddDivisionModal />
      </div>
      <div className="mt-8 text-muted-foreground">
        <p>Your division data table will be displayed here.</p>
      </div>
    </div>
  );
}
