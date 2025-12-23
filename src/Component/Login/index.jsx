import React, { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Checkbox,
    Button,
    FormControlLabel,
    Link,
    Paper,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

import BannerImg from '../../assets/banner.jpg';
import { useNavigate } from 'react-router-dom';
import { LOGIN } from '../../api/post';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
            LOGIN(data)
            .then((res) => {
                toast.success('Logged in successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                console.log(res.data?.data?.token);
                
                localStorage.setItem('token', res.data?.data?.token);
                navigate('/');
            })
            .catch((err) => {
                const message =
                    err?.data?.message ||
                    'Something went wrong, please try again.';
                toast.error(message, {
                    position: 'top-right',
                    autoClose: 3000,
                });
            });
    };

    return (
        <Box display="flex" height="100vh">
            {/* Left Panel */}
            <Box
                flex="1"
                position="relative"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                    backgroundImage: `url(${BannerImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white',
                    overflow: 'hidden',
                }}
            >
                {/* Overlay */}
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bgcolor="rgba(17, 24, 39, 0.7)"
                    zIndex={1}
                />
                <Box position="relative" zIndex={2} p={4} textAlign="center">
                    <Typography variant="h4" fontWeight={600} mb={1}>
                        Welcome to Admin Panel
                    </Typography>
                    <Typography variant="body1" mb={4}>
                        Manage your business with powerful tools
                    </Typography>
                </Box>
            </Box>

            {/* Right Panel */}
            <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                <Paper elevation={0} sx={{ width: '80%', maxWidth: 420, p: 2 }}>
                    <form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Sign In
                        </Typography>
                        <Typography variant="body2" mb={3}>
                            Enter your credentials to access your account
                        </Typography>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email Address"
                            placeholder="Enter your email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Invalid email address',
                                },
                            })}
                            error={Boolean(errors.email)}
                            helperText={errors.email?.message}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            placeholder="Enter your password"
                            type={showPassword ? 'text' : 'password'}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Minimum 6 characters required',
                                },
                            })}
                            error={Boolean(errors.password)}
                            helperText={errors.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <FormControlLabel control={<Checkbox />} label="Remember me" />
                            <Link href="#" fontSize={14}>
                                Forgot password?
                            </Link>
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: 'royagreen', mt: 2 }}
                        >
                            Sign In
                        </Button>

                        <Typography variant="body2" align="center" mt={2}>
                            Don’t have an account? <Link href="/register">Register</Link>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
