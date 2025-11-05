import AdminDashboard from "@/components/admin/dashboard";

export default function AdminPage() {
    // For now, the main admin page will show the leads dashboard.
    // This could be changed to a more general overview dashboard in the future.
    return (
        <div>
            <AdminDashboard />
        </div>
    )
}
