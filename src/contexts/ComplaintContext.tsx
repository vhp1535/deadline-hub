import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { complaints as initialComplaints, Complaint } from "@/data/mockData";

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "escalationLevel" | "retryCount">) => string;
  getComplaint: (id: string) => Complaint | undefined;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export function ComplaintProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    // Load from localStorage or use initial data
    const stored = localStorage.getItem("deadline_complaints");
    if (stored) {
      try {
        setComplaints(JSON.parse(stored));
      } catch {
        setComplaints(initialComplaints);
      }
    } else {
      setComplaints(initialComplaints);
    }
  }, []);

  useEffect(() => {
    // Persist to localStorage when complaints change
    if (complaints.length > 0) {
      localStorage.setItem("deadline_complaints", JSON.stringify(complaints));
    }
  }, [complaints]);

  const generateId = () => {
    const num = complaints.length + 1;
    return `CMP-${String(num).padStart(3, "0")}`;
  };

  const addComplaint = (data: Omit<Complaint, "id" | "createdAt" | "updatedAt" | "escalationLevel" | "retryCount">): string => {
    const id = generateId();
    const now = new Date().toISOString();
    
    const newComplaint: Complaint = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
      escalationLevel: 1,
      retryCount: 0,
    };

    setComplaints(prev => [newComplaint, ...prev]);
    return id;
  };

  const getComplaint = (id: string) => {
    return complaints.find(c => c.id.toUpperCase() === id.toUpperCase());
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
    ));
  };

  return (
    <ComplaintContext.Provider value={{ complaints, addComplaint, getComplaint, updateComplaint }}>
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error("useComplaints must be used within a ComplaintProvider");
  }
  return context;
}
