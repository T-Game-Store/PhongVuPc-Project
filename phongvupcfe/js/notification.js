document.addEventListener('DOMContentLoaded', () => {
    const bellBtn = document.getElementById('bell-btn');
    const logDropdown = document.getElementById('log-dropdown');
    const logContent = document.getElementById('log-content');
    const logCount = document.getElementById('log-count');

    bellBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpening = logDropdown.classList.contains('hidden');
        logDropdown.classList.toggle('hidden');

        if (isOpening) {
            fetchLogs(true);
        }
    });

    document.addEventListener('click', () => logDropdown.classList.add('hidden'));

    async function fetchLogs(isViewing = false) {
        try {
            const res = await fetch('http://localhost:8080/api/audit-logs');
            const logs = await res.json();
            
            const lastViewedCount = parseInt(localStorage.getItem('viewed_log_count') || 0);
            
            if (isViewing) {
                localStorage.setItem('viewed_log_count', logs.length);
                logCount.classList.add('hidden');
            } else if (logs.length > lastViewedCount) {
                logCount.innerText = logs.length - lastViewedCount;
                logCount.classList.remove('hidden');
            }

            logContent.innerHTML = logs.map(log => {
                let icon = 'fa-circle-info text-slate-400 bg-slate-50';
                if (log.module === 'AUTH') icon = 'fa-key text-emerald-500 bg-emerald-50';
                if (log.module === 'USER') icon = 'fa-user-plus text-indigo-500 bg-indigo-50';
                if (log.module === 'ROLE') icon = 'fa-shield-halved text-amber-500 bg-amber-50';

                return `
                    <div class="p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 flex items-start space-x-3">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${icon.split(' ')[2]}">
                            <i class="fa-solid ${icon.split(' ')[0]} text-xs"></i>
                        </div>
                        <div class="flex-1">
                            <div class="text-[12px] leading-snug">
                                <span class="font-bold text-slate-900">${log.username}</span>
                                <span class="text-slate-600"> ${log.dataAfter}</span>
                            </div>
                            <div class="text-[10px] text-slate-400 mt-1 uppercase font-medium">
                                ${new Date(log.createdAt).toLocaleString('vi-VN')}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch {
            logContent.innerHTML = `<div class="p-4 text-center text-xs text-red-400 italic">Không thể tải nhật ký.</div>`;
        }
    }

    setInterval(() => fetchLogs(false), 5000);
    fetchLogs(false);
});