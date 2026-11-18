import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { threadsApi } from "../../api/threads";
import { useAuthStore } from "../../store/authStore";
import { Navbar } from "../../components/common/Navbar";
import { ThreadList } from "../../components/thread/ThreadList";
import { ThreadDetail } from "../../components/thread/ThreadDetail";
import { Spinner } from "../../components/common/Spinner";
import { ShieldCheck, AlertCircle } from "lucide-react";

export function ClientDashboard() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 20,
    search: "",
    label: "client_reply", // ← यह add करो
  });

  const {
    data: threadsData,
    isLoading: isLoadingThreads,
    error: threadsError,
  } = useQuery({
    queryKey: ["client", "threads", filters],
    queryFn: () => threadsApi.getThreads(filters),
    enabled: !!accessToken,
    retry: 1,
  });

  const threads = threadsData?.threads || [];
  const totalThreads = threadsData?.total || 0;

  useEffect(() => {
    if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  const { data: selectedThread, isLoading: isLoadingThreadDetail } = useQuery({
    queryKey: ["thread", selectedThreadId],
    queryFn: () => threadsApi.getThread(selectedThreadId),
    enabled: !!selectedThreadId,
  });

  const clientActionMutation = useMutation({
    mutationFn: ({ threadId, action }) =>
      threadsApi.clientAction(threadId, action),
    onSuccess: (updatedThread) => {
      queryClient.invalidateQueries({ queryKey: ["client", "threads"] });
      queryClient.setQueryData(["thread", updatedThread.id], updatedThread);
      const remaining = threads.filter((t) => t.id !== updatedThread.id);
      setSelectedThreadId(remaining.length > 0 ? remaining[0].id : null);
    },
  });

  return (
    <div className="flex h-screen flex-col bg-slate-100 overflow-hidden">
      <Navbar />

      <div className="bg-purple-900 text-purple-100 px-6 py-2.5 text-xs flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-purple-300" />
          <span>
            Executive Client Portal &bull; Viewing threads classified as{" "}
            <strong className="text-white">Client Reply</strong> by your
            assistant.
          </span>
        </div>
        {user?.linked_assistant_id && (
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-purple-200">
            <span>Linked Assistant ID:</span>
            <span className="bg-purple-800/80 px-2 py-0.5 rounded text-white select-all">
              {user.linked_assistant_id}
            </span>
          </div>
        )}
      </div>

      {/* Error banner — shows exact API error without breaking layout */}
      {threadsError && (
        <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            <strong>Error fetching threads:</strong>{" "}
            {threadsError?.response?.data?.detail ||
              threadsError?.message ||
              "Unknown error"}
            {threadsError?.response?.status &&
              ` (Status ${threadsError.response.status})`}
          </span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-96 lg:w-[420px] flex-shrink-0 flex flex-col h-full">
          <ThreadList
            threads={threads}
            total={totalThreads}
            skip={filters.skip}
            limit={filters.limit}
            filters={filters}
            onFilterChange={setFilters}
            selectedThreadId={selectedThreadId}
            onSelectThread={(id) => setSelectedThreadId(id)}
            isLoading={isLoadingThreads}
          />
        </div>

        <div className="hidden md:flex flex-1 flex-col h-full overflow-hidden">
          <ThreadDetail
            thread={selectedThread}
            isLoading={isLoadingThreadDetail}
            role="client"
            onClientAction={(threadId, action) =>
              clientActionMutation.mutate({ threadId, action })
            }
            isClientActionPending={clientActionMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
