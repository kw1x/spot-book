import React, { useEffect, useState } from 'react';
import { workspacesApi } from '../api/workspaces.api';
import { Workspace, WorkspaceType } from '../types/workspace';
import {
  AlertCircle,
  Edit2,
  Plus,
  RefreshCw,
  Shield,
  Trash2,
  X,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'DESK' as WorkspaceType,
    capacity: 1,
    floor: 1,
    posX: 100,
    posY: 100,
    width: 70,
    height: 45,
    isActive: true,
  });

  const fetchWorkspaces = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await workspacesApi.getAllWorkspaces();
      setWorkspaces(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Не удалось загрузить рабочие места');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const openCreateModal = () => {
    setEditingWorkspace(null);
    setFormData({
      name: '',
      type: 'DESK',
      capacity: 1,
      floor: 1,
      posX: 100,
      posY: 100,
      width: 70,
      height: 45,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    setFormData({
      name: workspace.name,
      type: workspace.type,
      capacity: workspace.capacity,
      floor: workspace.floor,
      posX: workspace.posX,
      posY: workspace.posY,
      width: workspace.width,
      height: workspace.height,
      isActive: workspace.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingWorkspace) {
        await workspacesApi.updateWorkspace(editingWorkspace.id, formData);
      } else {
        await workspacesApi.createWorkspace(formData);
      }
      setModalOpen(false);
      fetchWorkspaces();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Не удалось сохранить рабочее место');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Вы действительно хотите удалить "${name}"?`)) return;
    try {
      await workspacesApi.deleteWorkspace(id);
      fetchWorkspaces();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Не удалось удалить рабочее место');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Администрирование рабочих мест
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Управление рабочими местами, координатами на схеме этажа и статусами доступности.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchWorkspaces}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить место</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 font-semibold">Название</th>
                <th className="px-4 py-3 font-semibold">Тип</th>
                <th className="px-4 py-3 font-semibold">Вместимость</th>
                <th className="px-4 py-3 font-semibold">Этаж</th>
                <th className="px-4 py-3 font-semibold">Координаты (X, Y)</th>
                <th className="px-4 py-3 font-semibold">Размер (Ш x В)</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
                <th className="px-4 py-3 font-semibold text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {workspaces.map((ws) => (
                <tr key={ws.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{ws.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        ws.type === 'MEETING_ROOM'
                          ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {ws.type === 'MEETING_ROOM' ? 'Переговорная' : 'Рабочий стол'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{ws.capacity} чел.</td>
                  <td className="px-4 py-3 text-muted-foreground">Этаж {ws.floor}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    ({ws.posX}, {ws.posY})
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {ws.width} × {ws.height}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        ws.isActive
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-500/10 text-slate-500'
                      }`}
                    >
                      {ws.isActive ? 'Активно' : 'Отключено'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(ws)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Редактировать"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ws.id, ws.name)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-base font-bold text-foreground">
                {editingWorkspace ? 'Редактирование места' : 'Новое рабочее место'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Название места</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Например: Стол 1 или Переговорная Aurora"
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Тип</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as WorkspaceType })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="DESK">Рабочий стол</option>
                    <option value="MEETING_ROOM">Переговорная</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Вместимость (чел.)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Этаж</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1 flex items-center justify-between pt-5">
                  <span className="font-semibold text-foreground">Активно в системе</span>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-border text-primary accent-primary cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-3">
                <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider block">
                  Координаты на схеме (0..1000)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground block">Позиция X</label>
                    <input
                      type="number"
                      value={formData.posX}
                      onChange={(e) => setFormData({ ...formData, posX: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded-lg border border-input bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block">Позиция Y</label>
                    <input
                      type="number"
                      value={formData.posY}
                      onChange={(e) => setFormData({ ...formData, posY: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded-lg border border-input bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block">Ширина</label>
                    <input
                      type="number"
                      value={formData.width}
                      onChange={(e) => setFormData({ ...formData, width: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded-lg border border-input bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block">Высота</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 rounded-lg border border-input bg-background text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted font-medium"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-sm"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
