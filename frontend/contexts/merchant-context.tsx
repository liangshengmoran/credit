"use client"

import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react"
import services, { type MerchantAPIKey, type UpdateAPIKeyRequest, isCancelError } from "@/lib/services"
import { toast } from "sonner"

/**
 * 商户数据状态接口
 */
interface MerchantDataState {
  apiKeys: MerchantAPIKey[]
  loading: boolean
  error: string | null
}

/**
 * 商户 Context 接口
 */
interface MerchantContextType extends MerchantDataState {
  loadAPIKeys: () => Promise<void>
  createAPIKey: (data: {
    app_name: string
    app_homepage_url: string
    redirect_uri: string
  }) => Promise<MerchantAPIKey>
  updateAPIKey: (id: number, data: UpdateAPIKeyRequest) => Promise<void>
  deleteAPIKey: (id: number) => Promise<void>
  refresh: () => Promise<void>
}

/**
 * 商户 Context
 */
const MerchantContext = createContext<MerchantContextType | undefined>(undefined)

/**
 * 商户 Provider Props
 */
interface MerchantProviderProps {
  children: ReactNode
}

/**
 * 商户数据 Provider
 * 提供全局商户数据状态管理，数据在页面切换间保持
 */
export function MerchantProvider({ children }: MerchantProviderProps) {
  const [state, setState] = useState<MerchantDataState>({
    apiKeys: [],
    loading: false, // 初始不加载，在需要时才加载
    error: null,
  })

  // 使用 ref 来标记是否已经加载过数据（全局级别）
  const hasLoadedRef = useRef(false)

  /**
   * 加载 API Keys
   */
  const loadAPIKeys = useCallback(async () => {
    // 如果已经加载过，直接返回
    if (hasLoadedRef.current && state.apiKeys.length > 0) {
      return
    }

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const data = await services.merchant.listAPIKeys()
      const validKeys = Array.isArray(data) ? data.filter(key => key != null) : []

      setState(prev => ({
        ...prev,
        apiKeys: validKeys,
        loading: false,
        error: null
      }))

      hasLoadedRef.current = true
    } catch (error) {
      if (isCancelError(error)) {
        return
      }

      const errorMessage = (error as Error).message || '无法加载 API Keys'
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }))

      toast.error('加载失败', {
        description: errorMessage
      })
    }
  }, [state.apiKeys.length])

  /**
   * 创建 API Key
   */
  const createAPIKey = useCallback(async (data: {
    app_name: string
    app_homepage_url: string
    redirect_uri: string
  }): Promise<MerchantAPIKey> => {
    const newKey = await services.merchant.createAPIKey(data)

    setState(prev => ({
      ...prev,
      apiKeys: [newKey, ...prev.apiKeys]
    }))

    return newKey
  }, [])

  /**
   * 更新 API Key
   */
  const updateAPIKey = useCallback(async (id: number, data: UpdateAPIKeyRequest): Promise<void> => {
    await services.merchant.updateAPIKey(id, data)

    // 更新本地状态中的API Key
    setState(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.map(key =>
        key.id === id ? { ...key, ...data } : key
      )
    }))
  }, [])

  /**
   * 删除 API Key
   */
  const deleteAPIKey = useCallback(async (id: number) => {
    await services.merchant.deleteAPIKey(id)

    setState(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.filter(key => key && key.id !== id)
    }))
  }, [])

  /**
   * 刷新数据
   */
  const refresh = useCallback(async () => {
    hasLoadedRef.current = false
    await loadAPIKeys()
  }, [loadAPIKeys])

  const value: MerchantContextType = {
    ...state,
    loadAPIKeys,
    createAPIKey,
    updateAPIKey,
    deleteAPIKey,
    refresh,
  }

  return (
    <MerchantContext.Provider value={value}>
      {children}
    </MerchantContext.Provider>
  )
}

/**
 * 使用商户数据 Hook
 */
export function useMerchant(): MerchantContextType {
  const context = useContext(MerchantContext)
  if (context === undefined) {
    throw new Error('useMerchant must be used within a MerchantProvider')
  }
  return context
}
