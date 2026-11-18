import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../../api/accounts';
import { threadsApi } from '../../api/threads';
import { aiApi } from '../../api/ai';
import { OnboardingPage } from './OnboardingPage';
import { Navbar } from '../../components/common/Navbar';
import { StatsSidebar } from '../../components/assistant/StatsSidebar';
import { ThreadList } from '../../components/thread/ThreadList';
import { ThreadDetail } from '../../components/thread/ThreadDetail';
import { AIChatModal } from '../../components/chat/AIChatModal';
import { DraftsListModal } from '../../components/drafts/DraftsListModal';
import { ActivityLogModal } from '../../components/activity/ActivityLogModal';
import { Spinner } from '../../components/common/Spinner';

export function AssistantDashboard() {
  const queryClient = useQueryClient();

  // Modal visibility states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  // Filter & Selection states
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [filters, setFilters] = useState({
    skip: 0,
    limit: 20,
    search: '',
    label: undefined,
    segment: undefined,
    is_important: undefined,
    is_archived: undefined,
  });

  // 1. Fetch connected accounts
  const {
    data: accounts,
    isLoading: isCheckingAccounts,
    refetch: refetchAccounts,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAccounts,
  });

  const hasConnectedAccount = accounts && accounts.length > 0;

  // 2. Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['threads', 'stats'],
    queryFn: threadsApi.getStats,
    enabled: !!hasConnectedAccount,
  });

  // 3. Fetch threads list
  const {
    data: threadsData,
    isLoading: isLoadingThreads,
    refetch: refetchThreads,
  } = useQuery({
    queryKey: ['threads', 'list', filters],
    queryFn: () => threadsApi.getThreads(filters),
    enabled: !!hasConnectedAccount,
  });

  const threads = threadsData?.threads || [];
  const totalThreads = threadsData?.total || 0;

  // Auto-select first thread on initial load if none selected
  useEffect(() => {
    if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  // 4. Fetch selected thread detail
  const {
    data: selectedThread,
    isLoading: isLoadingThreadDetail,
  } = useQuery({
    queryKey: ['thread', selectedThreadId],
    queryFn: () => threadsApi.getThread(selectedThreadId),
    enabled: !!selectedThreadId,
  });

  // Mutations for thread actions
  const labelMutation = useMutation({
    mutationFn: ({ threadId, label }) => threadsApi.updateLabel(threadId, label),
    onSuccess: (updatedThread) => {
      queryClient.setQueryData(['thread', updatedThread.id], updatedThread);
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const importantMutation = useMutation({
    mutationFn: (threadId) => threadsApi.toggleImportant(threadId),
    onSuccess: (updatedThread) => {
      queryClient.setQueryData(['thread', updatedThread.id], updatedThread);
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (threadId) => threadsApi.toggleArchive(threadId),
    onSuccess: (updatedThread) => {
      queryClient.setQueryData(['thread', updatedThread.id], updatedThread);
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const readMutation = useMutation({
    mutationFn: ({ threadId, isRead }) => threadsApi.updateRead(threadId, isRead),
    onSuccess: (updatedThread) => {
      queryClient.setQueryData(['thread', updatedThread.id], updatedThread);
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ threadId, status }) => threadsApi.updateStatus(threadId, status),
    onSuccess: (updatedThread) => {
      queryClient.setQueryData(['thread', updatedThread.id], updatedThread);
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const reclassifyMutation = useMutation({
    mutationFn: (threadId) => aiApi.classifyThread(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread', selectedThreadId] });
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  // Handler for quick sidebar filter clicks
  const handleSelectStatFilter = (filterUpdates) => {
    setFilters({
      skip: 0,
      limit: 20,
      search: '',
      label: undefined,
      segment: undefined,
      is_important: undefined,
      is_archived: undefined,
      ...filterUpdates,
    });
  };

  // Loading accounts state
  if (isCheckingAccounts) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-3 text-xs font-medium">Checking connected accounts...</p>
        </div>
      </div>
    );
  }

  // If no account connected, show onboarding screen
  if (!hasConnectedAccount) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <OnboardingPage
          onAccountConnected={() => {
            refetchAccounts();
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-100 overflow-hidden">
      {/* Top Navigation */}
      <Navbar
        onOpenChat={() => setIsChatOpen(true)}
        onOpenDrafts={() => setIsDraftsOpen(true)}
        onOpenActivity={() => setIsActivityOpen(true)}
      />

      {/* Main 3-Column Interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column: Stats & Categorization Sidebar */}
        <div className="hidden lg:block">
          <StatsSidebar
            stats={stats}
            activeFilters={filters}
            onSelectFilter={handleSelectStatFilter}
          />
        </div>

        {/* Middle Column: Threads List with Filters & Pagination */}
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
            onToggleImportant={(id) => importantMutation.mutate(id)}
            onToggleArchive={(id) => archiveMutation.mutate(id)}
            isLoading={isLoadingThreads}
          />
        </div>

        {/* Right Column: Thread Detail & Messages Timeline */}
        <div className="hidden md:flex flex-1 flex-col h-full overflow-hidden">
          <ThreadDetail
            thread={selectedThread}
            isLoading={isLoadingThreadDetail}
            role="assistant"
            onUpdateLabel={(threadId, label) => labelMutation.mutate({ threadId, label })}
            onToggleImportant={(threadId) => importantMutation.mutate(threadId)}
            onToggleArchive={(threadId) => archiveMutation.mutate(threadId)}
            onUpdateRead={(threadId, isRead) => readMutation.mutate({ threadId, isRead })}
            onUpdateStatus={(threadId, status) => statusMutation.mutate({ threadId, status })}
            onReclassify={(threadId) => reclassifyMutation.mutate(threadId)}
            isReclassifying={reclassifyMutation.isPending}
            onDraftSaved={() => {
              queryClient.invalidateQueries({ queryKey: ['drafts'] });
            }}
          />
        </div>
      </div>

      {/* Floating Modals for Assistant Features */}
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <DraftsListModal isOpen={isDraftsOpen} onClose={() => setIsDraftsOpen(false)} />
      <ActivityLogModal isOpen={isActivityOpen} onClose={() => setIsActivityOpen(false)} />
    </div>
  );
}
