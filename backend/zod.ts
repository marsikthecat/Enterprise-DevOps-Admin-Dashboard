import { z } from "zod";

export const auditLogSchema = z.object({
    action: z.string({
        error: "action must be a string"
    }).min(1, {
        error: "action cannot be empty"
    }).max(100, {
        error: "action cannot exceed 100 characters"
    }),
    author: z.string({
        error: "author must be a string"
    }).min(1, {
        error: "author cannot be empty"
    }).max(100, {
        error: "author cannot exceed 100 characters"
    }),
})

export const roleSchema = z.object({
    name: z.string({
        error: "name must be a string"
    }).min(1, {
        error: "role cannot be empty"
    })
})

export const updateRoleSchemaWithPermissions = z.object({
    permissions: z.array(z.object({
        key: z.string({
          error: "key must be a string"
        }).min(1, {
          error: "key cannot be empty"
        }),
        name: z.string({
          error: "name must be a string"
        }).min(1, {
          error: "name cannot be empty"
        }),
        category: z.string({
          error: "category must be a string"
        }).min(1, {
          error: "category cannot be empty"
        })
    }))
})

export const serverSchema = z.object({
    id: z.string({
        error: "id must be a string"
    }).min(1, {
        error: "id cannot be empty"
    }),
    type: z.string({
        error: "type must be a string"
    }).min(1, {
        error: "type cannot be empty"
    }),
    cpu: z.number({
        error: "cpu must be an number"
    }).int().nonnegative(),
    memory: z.number({
        error: "memory must be an number"
    }).int().nonnegative(),
    storage: z.number({
        error: "storage must be an number"
    }).int().nonnegative(),
    region: z.string({
        error: "region must be a string"
    }).min(1, {
        error: "region cannot be empty"
    })
})

export const containerSchema = z.object({
    image: z.string({
        error: "image must be a string"
    }).min(1, {
        error: "image cannot be empty"
    }).max(100, {
        error: "image cannot exceed 100 characters"
    }),
    status: z.string({
        error: "status must be a string"
    }).min(1, {
        error: "status cannot be empty"
    }).max(100, {
        error: "status cannot exceed 100 characters"
    }),
    ports: z.string({
        error: "ports must be a string"
    }).min(1, {
        error: "ports cannot be empty"
    }).max(100, {
        error: "ports cannot exceed 100 characters"
    }),
    serverId: z.string({
        error: "serverId must be a string"
    }).min(1, {
        error: "serverId cannot be empty"
    }).max(100, {
        error: "serverId cannot exceed 100 characters"
    })
})

export const deployContainerSchema = containerSchema.omit({
    serverId: true,
})

export const userSchema = z.object({
    name: z.string({
        error: "name must be a string"
    }).min(1, {
        error: "name cannot be empty"
    }).max(100, {
        error: "name cannot exceed 100 characters"
    }),
    email: z.email({
        error: "invalid email detected"
    }).min(1, {
        error: "email cannot be empty"
    }).max(100, {
        error: "email cannot exceed 100 characters"
    }),
    password: z.string({
        error: "password must be a string"
    }).min(10, {
        error: "password needs at least 10 characters"
    }), 
    role: z.string().optional(),
    status: z.string().optional(),
    avatar: z.string().optional(),
})

export const userUpdateSchema = userSchema.omit({
    avatar: true
}).extend({
    sessions: z.int().positive(),
})

export const loginUserSchema = userSchema.omit({
    name: true
})

export type AuditLog = z.infer<typeof auditLogSchema>;

export type Role = z.infer<typeof roleSchema>;

export type UpdateRoleWithPermissions = z.infer<typeof updateRoleSchemaWithPermissions>;

export type Server = z.infer<typeof serverSchema>;

export type User = z.infer<typeof userSchema>;

export type LoginUser = z.infer<typeof loginUserSchema>;

export type Container = z.infer<typeof containerSchema>;

export type DeployContainer = z.infer<typeof deployContainerSchema>;

export type UpdatedUser = z.infer<typeof userUpdateSchema>;