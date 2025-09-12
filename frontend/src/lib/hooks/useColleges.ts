import { useQuery, useMutation, useQueryClient } from "react-query";
import collegesApi from "../../services/modules/colleges.api";
import { queryKeys } from "../../store/queryClient";
import type {
  CollegeListQuery,
  College,
  CollegeDetail,
  CollegeFilters,
  CompareRequest,
} from "../../types/api";

export const useColleges = (filters: CollegeListQuery) => {
  return useQuery({
    queryKey: queryKeys.colleges.list(filters),
    queryFn: () => collegesApi.getColleges(filters),
    keepPreviousData: true, // Keep previous data while fetching new data
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCollege = (id: string) => {
  return useQuery({
    queryKey: queryKeys.colleges.detail(id),
    queryFn: () => collegesApi.getCollege(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCollegeFilters = () => {
  return useQuery({
    queryKey: queryKeys.colleges.filters,
    queryFn: collegesApi.getFilters,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCompareColleges = (ids: string[]) => {
  return useQuery({
    queryKey: queryKeys.colleges.compare(ids),
    queryFn: () => collegesApi.compareColleges({ ids }),
    enabled: ids.length >= 2 && ids.length <= 4,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Admin mutations
export const useCreateCollege = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collegesApi.createCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.colleges.all });
    },
  });
};

export const useUpdateCollege = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<College> }) =>
      collegesApi.updateCollege(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.colleges.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.colleges.detail(id),
      });
    },
  });
};

export const useDeleteCollege = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collegesApi.deleteCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.colleges.all });
    },
  });
};
