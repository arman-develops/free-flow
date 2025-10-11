import { associatesApi, tasksApi } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Calendar, CheckCircle2, Circle, Clock, Loader, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUpdateTask } from "@/hooks/use-tasks"

interface AssignedAssociatesProps {
    projectID: string,
    projectCurrency: string
}

export default function AssociatesAssignedView({projectID, projectCurrency}: AssignedAssociatesProps) {

    const updateTask = useUpdateTask()

    const {
        data: associateResponse,
        isLoading: associateLoading,
        error: associateError,
    } = useQuery({
        queryKey: ["associates"],
        queryFn: associatesApi.getAssociatesByUserID
    })

    const { 
        data: tasksResponse, 
        isLoading: tasksLoading,
        error: tasksError
    } = useQuery({
        queryKey: ["tasks", projectID],
        queryFn: () => tasksApi.getTaskByProjectID(projectID),
    })

    const associates = associateResponse?.success ? associateResponse?.data : []
    const tasks = tasksResponse?.success ? tasksResponse?.data : []
    const assignedAssociateIds = tasks
        .map((task: any) => task.assigned_to_associate)
        .filter((id: string | null) => !!id);
    const uniqueAssignedIds = Array.from(new Set(assignedAssociateIds));
    const assignedAssociates = associates.filter((associate: any) =>
        uniqueAssignedIds.includes(associate.id)
    )
    
    const getAssociateTasks = (associateId: string) => {
        return tasks.filter((task:any) => task.assigned_to_associate === associateId);
    };

    // Calculate days until deadline
    const getDaysUntilDeadline = (dueDate:any) => {
        if (!dueDate) return null;
        const today = new Date();
        const deadline = new Date(dueDate);
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Get urgency color based on days remaining
    const getUrgencyColor = (daysRemaining: number) => {
        if (daysRemaining === null) return 'bg-gray-100 text-gray-600';
        if (daysRemaining < 0) return 'bg-red-100 text-red-700';
        if (daysRemaining <= 3) return 'bg-orange-100 text-orange-700';
        if (daysRemaining <= 7) return 'bg-yellow-100 text-yellow-700';
        return 'bg-green-100 text-green-700';
    };

    // Get status icon and color
    const getStatusDisplay = (status: string) => {
        const statusConfig:any = {
            todo: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-50', label: 'To Do' },
            'in-progress': { icon: Loader, color: 'text-blue-500', bg: 'bg-blue-50', label: 'In Progress' },
            completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', label: 'Completed' },
        };
        return statusConfig[status] || statusConfig.todo;
    };

    // Get priority badge color
    const getPriorityColor = (priority:string) => {
        const colors:any = {
            low: 'bg-blue-100 text-blue-700',
            medium: 'bg-yellow-100 text-yellow-700',
            high: 'bg-red-100 text-red-700',
        };
        return colors[priority] || colors.medium;
    };

    // Format currency
    const formatCurrency = (currency: string, value:number) => {
        if (!value) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        }).format(value);
    };

    const handleDeleteTask = async (task_id: string) => {
        await updateTask.mutateAsync({id: task_id, data: {assigned_to_associate: null}})
    }

    return (
        <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Assigned Associates</h2>
            <div className="text-sm text-gray-500">
            {assignedAssociates.length} {assignedAssociates.length === 1 ? 'Associate' : 'Associates'} with active tasks
            </div>
        </div>

        {assignedAssociates.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 12H8m8 0l-4-4m4 4l-4 4m0 0l4-4m-4 4V8"
        />
        </svg>
        <h3 className="text-lg font-semibold text-gray-700">No Assigned Associates</h3>
        <p className="text-gray-500 mt-2 max-w-md">
        No associates have been assigned to any tasks yet. Once you assign a task to an associate, 
        their details and progress will appear here.
        </p>
    </div>
    ) : (
            assignedAssociates.map((associate:any) => {
                const associateTasks = getAssociateTasks(associate.id);
                const totalEstimatedHours = associateTasks.reduce((sum:number, task:any) => sum + (task.estimated_hours || 0), 0);
                const totalActualHours = associateTasks.reduce((sum:number, task:any) => sum + (task.actual_hours || 0), 0);
                const totalValue = associateTasks.reduce((sum:number, task:any) => sum + (task.task_value || 0), 0);

                return (
                    <div key={associate.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        {/* Associate Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                <h3 className="text-xl font-semibold text-white">{associate.name}</h3>
                                <div className="flex items-center gap-4 mt-2 text-blue-100 text-sm">
                                    <span>{associate.email}</span>
                                    <span>•</span>
                                    <span>{associate.phone}</span>
                                </div>
                                    {associate.skills && associate.skills.length > 0 && (
                                        <div className="flex gap-2 mt-2">
                                            {associate.skills.map((skill:any, idx:number) => (
                                                <span key={idx} className="px-2 py-1 bg-blue-500 bg-opacity-50 text-white text-xs rounded">
                                                {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                    <div className="text-right">
                                    <div className="text-blue-100 text-sm">Tasks Assigned</div>
                                    <div className="text-3xl font-bold text-white">{associateTasks.length}</div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Total Value</div>
                                <div className="text-lg font-semibold text-gray-900">{formatCurrency(projectCurrency, totalValue)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Est. Hours</div>
                                <div className="text-lg font-semibold text-gray-900">{totalEstimatedHours.toFixed(1)}h</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide">Actual Hours</div>
                                <div className="text-lg font-semibold text-gray-900">{totalActualHours.toFixed(1)}h</div>
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="divide-y divide-gray-200">
                            {associateTasks.map((task:any) => {
                                const daysRemaining = getDaysUntilDeadline(task.due_date);
                                const statusDisplay = getStatusDisplay(task.status);
                                const StatusIcon = statusDisplay.icon;

                                return (
                                <div key={task.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-base font-semibold text-gray-900 truncate">{task.title}</h4>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                            </div>
                                            
                                            {task.description && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                            {/* Status */}
                                            <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${statusDisplay.bg}`}>
                                                <StatusIcon className={`h-4 w-4 ${statusDisplay.color}`} />
                                                <span className={`font-medium ${statusDisplay.color}`}>{statusDisplay.label}</span>
                                            </div>

                                            {/* Deadline */}
                                            {task.due_date && (
                                                <div className={`flex items-center gap-1.5 px-2 py-1 rounded ${getUrgencyColor(daysRemaining as number)}`}>
                                                <Calendar className="h-4 w-4" />
                                                <span className="font-medium">
                                                    {daysRemaining === null ? 'No deadline' :
                                                    daysRemaining < 0 ? `${Math.abs(daysRemaining)} days overdue` :
                                                    daysRemaining === 0 ? 'Due today' :
                                                    `${daysRemaining} days left`}
                                                </span>
                                                </div>
                                            )}

                                            {/* Hours */}
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <Clock className="h-4 w-4" />
                                                <span>{task.estimated_hours || 0}h est. / {task.actual_hours || 0}h actual</span>
                                            </div>

                                            {/* Value */}
                                            {task.task_value && (
                                                <div className="font-semibold text-green-600">
                                                {formatCurrency(projectCurrency, task.task_value)}
                                                </div>
                                            )}
                                            </div>

                                            {/* Start and Due Date */}
                                            {(task.start_date || task.due_date) && (
                                            <div className="mt-2 text-xs text-gray-500 flex gap-4">
                                                {task.start_date && (
                                                <span>Started: {new Date(task.start_date).toLocaleDateString()}</span>
                                                )}
                                                {task.due_date && (
                                                <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                            )}
                                        </div>
                                        <button
                                            onClick={ () => handleDeleteTask(task.id)}
                                            className={`
                                            group relative p-2 rounded-lg transition-all duration-200
                                            cursor-pointer
                                            bg-red-50
                                            `}
                                            title="Delete task"
                                        >
                                            <Trash2 
                                            className={`
                                                h-5 w-5 transition-colors duration-200
                                                text-red-600
                                                animate-pulse}
                                            `}
                                            />
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                );
            }))}
        </div>
    )
}