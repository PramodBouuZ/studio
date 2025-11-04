import AdminDashboard from "@/components/admin/dashboard";

export default function AdminPage() {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tighter font-headline">Lead Management</h1>
                <p className="text-muted-foreground">Verify, assign, and manage all incoming leads.</p>
            </header>
            <AdminDashboard />
        </div>
    )
}